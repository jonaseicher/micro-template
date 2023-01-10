import { Sequelize, DataTypes } from 'sequelize';
import { Doctor } from './model';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'printer-db.sqlite',
});

Doctor.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Doctor',
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  },
);

export async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export async function syncTables() {
  await Doctor.sync({ alter: true });
}

testDbConnection().then(() => {
  syncTables().then(() => console.log('tables have been synced'));
});

// d.save();
// doctor.save();

// console.log('username', doctor.getDataValue('username'));

// doctor.save();

// Doctor.findAll().then((res) => {
//   console.log(res);
//   // const vova = res[res.length - 1];
//   // console.log(vova);
//   // vova.setDataValue('password', 'newpassword');
//   // vova.username = 'p2';
//   // vova.save();
// });

// async function getDoctorByUsername(username: string): Promise<Doctor | null> {
//   try {
//     const doctor = await Doctor.findOne({
//       where: {
//         username,
//       },
//     });

//     return doctor;
//   } catch (error) {
//     return null;
//   }
// }

// async function addDoctor(newDoctor: any): Promise<Doctor | null> {
//   try {
//     const d = getDoctorByUsername(newDoctor);
//     if (!d) {
//       return null;
//     }

//     const doctor = await Doctor.create(newDoctor);

//     return doctor;
//   } catch (error) {
//     console.log(error);

//     return null;
//   }
// }
