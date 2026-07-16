'use strict';

/**
 * Initial schema: the `runs` table + a created_at index.
 *
 * Baseline-safe: dev already has this table (created by the pre-Sequelize
 * bootstrap), while staging/live start empty. The guard makes `up` a no-op
 * when `runs` already exists, so this migration records cleanly into
 * SequelizeMeta everywhere without trying to recreate an existing table.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.map((t) => String(t).toLowerCase()).includes('runs')) return;

    await queryInterface.createTable('runs', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      input: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      result: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addIndex('runs', {
      name: 'runs_created_at_idx',
      fields: [{ name: 'created_at', order: 'DESC' }],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('runs');
  },
};
