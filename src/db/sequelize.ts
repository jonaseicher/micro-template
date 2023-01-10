import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'src/db/database.sqlite',
});

export class Doctor extends Model {}

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

const doctor = new Doctor();

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

export async function startDb() {
  try {
    await Doctor.sync();
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const doctors = await Doctor.findAll();
    console.log('startDb –> doctors', doctors);

    // let praxis = await Doctor.findAll({
    //   where: {
    //     username: 'praxis',
    //   },
    // });
    // console.log('startDb –> praxis', praxis);

    // const joshua = await getDoctorByUsername('Joshua');
    // console.log('startDb –> joshua', joshua);

    // add new
    // const newDoctor = await addDoctor({
    //   username: 'Joshua',
    //   password: 'informme',
    //   lastName: 'Gawlitza',
    //   firstName: 'Joshua',
    //   birthdate: '2022-12-14',
    //   signature: '',
    // });
    // console.log('startDb –> newDoctor', newDoctor);

    const newDoctor = await doctor.update(
      {
        username: 'Vova',
        password: 'informme',
        lastName: 'Bondar',
        firstName: 'Vova',
        birthdate: '2022-12-14',
        signature: '',
      },
      { where: {} },
    );
    console.log('startDb –> newDoctor', newDoctor);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
