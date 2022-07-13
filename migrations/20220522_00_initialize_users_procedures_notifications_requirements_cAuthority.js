const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [2,20]
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    await queryInterface.createTable('contracting_authorities', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      jib: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    await queryInterface.createTable('procedures', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      number: {
        type: DataTypes.STRING,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      framework_agreement: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      criterion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      auction: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      budget: {
        type: DataTypes.FLOAT
      },
      delivery_location: {
        type: DataTypes.STRING
      },
      delivery_date: {
        type: DataTypes.INTEGER
      },
      payment: {
        type: DataTypes.INTEGER
      },
      offer_validity: {
        type: DataTypes.INTEGER
      },
      filled_draft: {
        type: DataTypes.BOOLEAN
      },
      copy: {
        type: DataTypes.INTEGER
      },
      amount: {
        type: DataTypes.FLOAT
      },
      phase: {
        type: DataTypes.STRING
      },
      comment: {
        type: DataTypes.TEXT
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      contracting_authority_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'contracting_authorities',
          key: 'id'
        }
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    await queryInterface.createTable('requirements', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      can_do: {
        type: DataTypes.BOOLEAN
      },
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      procedure_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'procedures',
          key: 'id'
        }
      }
    })
    await queryInterface.createTable('notifications', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: DataTypes.TEXT
      },
      alarm: {
        type: DataTypes.DATE
      },
      procedure_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'procedures',
          key: 'id'
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('contracting_authorities')
    await queryInterface.dropTable('procedures')
    await queryInterface.dropTable('requirement')
    await queryInterface.dropTable('notifications')
  }
}