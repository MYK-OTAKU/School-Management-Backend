const ClassRoomService = require('../../services/ClassRoomService');
const { ClassRoom, ClassGroup, SchoolYear } = require('../../models');

jest.setTimeout(30000);

describe('🧪 ClassRoomService', () => {
  let schoolYear;

  beforeEach(async () => {
    schoolYear = await SchoolYear.create({ name: '2024-2025', isActive: true });
  });

  describe('createClassRoom', () => {
    it('crée une classe avec ses groupes', async () => {
      const classroom = await ClassRoomService.createClassRoom({
        name: 'CE1',
        schoolYearId: schoolYear.id,
        level: 'primaire',
        groups: [{ name: 'Groupe A', capacity: 20 }]
      });

      expect(classroom.name).toBe('CE1');
      expect(classroom.groups).toHaveLength(1);
      expect(classroom.groups[0].name).toBe('Groupe A');
    });

    it('empêche la duplication de nom', async () => {
      await ClassRoomService.createClassRoom({ name: 'CE1', schoolYearId: schoolYear.id });

      await expect(
        ClassRoomService.createClassRoom({ name: 'CE1', schoolYearId: schoolYear.id })
      ).rejects.toThrow('Une classe avec ce nom existe déjà');
    });
  });

  describe('updateClassRoom', () => {
    it('met à jour le nom et synchronise les groupes', async () => {
      const classroom = await ClassRoomService.createClassRoom({
        name: 'CE1',
        schoolYearId: schoolYear.id,
        groups: [{ name: 'Groupe A' }]
      });

      const otherYear = await SchoolYear.create({ name: '2025-2026' });

      const updated = await ClassRoomService.updateClassRoom(classroom.id, {
        name: 'CE1 Bis',
        schoolYearId: otherYear.id
      });

      expect(updated.name).toBe('CE1 Bis');
      expect(updated.schoolYearId).toBe(otherYear.id);

      const groups = await ClassGroup.findAll({ where: { classroomId: classroom.id } });
      expect(groups.every(group => group.schoolYearId === otherYear.id)).toBe(true);
    });
  });

  describe('createGroup', () => {
    it('crée un groupe pour une classe', async () => {
      const classroom = await ClassRoomService.createClassRoom({ name: 'CE1', schoolYearId: schoolYear.id });

      const group = await ClassRoomService.createGroup(classroom.id, { name: 'Groupe B', capacity: 18 });

      expect(group.name).toBe('Groupe B');
      expect(group.classroomId).toBe(classroom.id);
    });
  });

  describe('deleteClassRoom', () => {
    it('refuse la suppression si des groupes existent', async () => {
      const classroom = await ClassRoomService.createClassRoom({
        name: 'CE1',
        schoolYearId: schoolYear.id,
        groups: [{ name: 'Groupe A' }]
      });

      await expect(ClassRoomService.deleteClassRoom(classroom.id))
        .rejects.toThrow('Impossible de supprimer une classe ayant des groupes');
    });

    it('supprime la classe sans groupe', async () => {
      const classroom = await ClassRoomService.createClassRoom({ name: 'CE2', schoolYearId: schoolYear.id });

      const result = await ClassRoomService.deleteClassRoom(classroom.id);
      expect(result.success).toBe(true);

      const exists = await ClassRoom.findByPk(classroom.id);
      expect(exists).toBeNull();
    });
  });
});
