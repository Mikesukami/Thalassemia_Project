module.exports = (sequelize, Sequelize) => {
    const Predict = sequelize.define(
        'predict',
        {
            predictId: {
                type: Sequelize.INTEGER,
                field: 'predict_id',
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            mediaId: {
                type: Sequelize.INTEGER,
                field: 'media_id',
                allowNull: false,
                references: {
                    model: 'media', // Reference to media table
                    key: 'media_id'
                },
                onDelete: 'CASCADE' // Delete prediction if media is deleted
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'user_id',
                allowNull: false,
                references: {
                    model: 'user', // Reference to user table
                    key: 'user_id'
                },
                onDelete: 'CASCADE' // Delete prediction if user is deleted
            },
            prediction: {
                type: Sequelize.STRING,
                field: 'prediction',
                allowNull: false
            },
            modelUsed: {
                type: Sequelize.STRING,
                field: 'model_used',
                allowNull: false
            },
            confidence: {
                type: Sequelize.FLOAT, // Store confidence level of the prediction
                field: 'confidence',
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                field: 'created_at',
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                field: 'updated_at',
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        },
        {
            timestamps: true, // Automatically add createdAt and updatedAt
            freezeTableName: true // Prevent Sequelize from pluralizing table name
        }
    );

    return Predict;
};
