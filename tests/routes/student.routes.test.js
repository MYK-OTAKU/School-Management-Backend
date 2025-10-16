const request = require('supertest');
const app = require('../../app');
const { TestFactory } = require('../helpers/testHelpers');

describe('🌐 Routes /api/students', () => {
  let authHeader;
  let activeYear;

  beforeEach(async () => {
    activeYear = await TestFactory.createActiveSchoolYear({ name: '2024-2025' });

    const role = await TestFactory.createRole('StudentManager', [
      'STUDENTS_VIEW',
      'STUDENTS_CREATE',
      'STUDENTS_UPDATE',
      'STUDENTS_DELETE',
      'ENROLLMENTS_MANAGE'
    ]);

    const user = await TestFactory.createUser({
      username: `student-admin-${Date.now()}`,
      email: `student-admin-${Date.now()}@test.com`,
      roleId: role.id
    });

    const token = TestFactory.generateAuthToken(user);
    authHeader = { Authorization: `Bearer ${token}` };
  });

  it('crée un élève et attribue un matricule', async () => {
    const response = await request(app)
      .post('/api/students')
      .set(authHeader)
      .send({
        firstName: 'Moussa',
        lastName: 'Traoré'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.firstName).toBe('Moussa');
    expect(response.body.data.schoolYearId).toBe(activeYear.id);
    const expectedPrefix = `STU${activeYear.name.slice(2, 4)}`;
    expect(response.body.data.matricule).toMatch(new RegExp(`^${expectedPrefix}\\d{4}$`));
  });

  it('liste les élèves avec pagination', async () => {
    await request(app)
      .post('/api/students')
      .set(authHeader)
      .send({ firstName: 'Awa', lastName: 'Keita' });

    const response = await request(app)
      .get('/api/students')
      .set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
    expect(response.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data.pagination).toMatchObject({ page: 1, limit: 20 });
  });

  it('met à jour une inscription élève', async () => {
    const creation = await request(app)
      .post('/api/students')
      .set(authHeader)
      .send({ firstName: 'Fatou', lastName: 'Sangaré' });

    const studentId = creation.body.data.id;

    const classroom = await TestFactory.createClassRoom({
      name: 'CM2',
      schoolYearId: activeYear.id
    });

    const classGroup = await TestFactory.createClassGroup({
      name: 'Groupe B',
      classroomId: classroom.id
    });

    const response = await request(app)
      .post(`/api/students/${studentId}/enroll`)
      .set(authHeader)
      .send({
        schoolYearId: activeYear.id,
        classroomId: classroom.id,
        classGroupId: classGroup.id
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.classroomId).toBe(classroom.id);
    expect(response.body.data.classGroupId).toBe(classGroup.id);
  });

  it('refuse l’accès si permission absente', async () => {
    const viewerRole = await TestFactory.createRole('StudentViewer', ['STUDENTS_VIEW']);
    const viewer = await TestFactory.createUser({
      username: `student-viewer-${Date.now()}`,
      email: `student-viewer-${Date.now()}@test.com`,
      roleId: viewerRole.id
    });

    const viewerToken = TestFactory.generateAuthToken(viewer);

    const response = await request(app)
      .post('/api/students')
      .set({ Authorization: `Bearer ${viewerToken}` })
      .send({ firstName: 'Ibrahim', lastName: 'Konaté' });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
