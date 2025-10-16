const SchoolYearService = require('../../services/SchoolYearService');
const { SchoolYear } = require('../../models');

jest.setTimeout(30000);

describe('🧪 SchoolYearService', () => {
  describe('create', () => {
    it('crée une année scolaire inactive par défaut', async () => {
      const schoolYear = await SchoolYearService.create({
        name: '2024-2025',
        startDate: '2024-09-01',
        endDate: '2025-06-30'
      });

      expect(schoolYear).toBeDefined();
      expect(schoolYear.name).toBe('2024-2025');
      expect(schoolYear.isActive).toBe(false);
    });

    it('active l\'année et désactive les autres', async () => {
      await SchoolYearService.create({ name: '2023-2024', isActive: true });
      const second = await SchoolYearService.create({ name: '2024-2025', isActive: true });

      const all = await SchoolYear.findAll({ order: [['name', 'ASC']] });

      expect(all[0].isActive).toBe(false);
      expect(all[1].isActive).toBe(true);
      expect(second.isActive).toBe(true);
    });

    it('rejette une date de fin antérieure à la date de début', async () => {
      await expect(SchoolYearService.create({
        name: '2025-2026',
        startDate: '2025-09-01',
        endDate: '2025-06-30'
      })).rejects.toThrow('La date de fin doit être postérieure à la date de début');
    });
  });

  describe('update', () => {
    it('met à jour les informations et l\'activation', async () => {
      const year = await SchoolYearService.create({ name: '2024-2025' });
      await SchoolYearService.create({ name: '2025-2026', isActive: true });

      const updated = await SchoolYearService.update(year.id, { isActive: true });
      const reloaded = await SchoolYear.findByPk(updated.id);
      const all = await SchoolYear.findAll();

      expect(reloaded.isActive).toBe(true);
      expect(all.filter(y => y.isActive).length).toBe(1);
    });
  });

  describe('delete', () => {
    it('supprime une année inactive', async () => {
      const year = await SchoolYearService.create({ name: '2024-2025' });
      await SchoolYearService.delete(year.id);

      const remaining = await SchoolYear.findAll();
      expect(remaining.length).toBe(0);
    });

    it('refuse la suppression d\'une année active', async () => {
      const year = await SchoolYearService.create({ name: '2024-2025', isActive: true });
      await expect(SchoolYearService.delete(year.id))
        .rejects.toThrow('Impossible de supprimer une année scolaire active');
    });
  });
});
