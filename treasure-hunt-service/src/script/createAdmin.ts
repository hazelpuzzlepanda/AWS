import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user/UserRepositories';
import dotenv from 'dotenv';
import readline from 'readline';
import { Permission, UserType } from '../utils/constant';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  console.error('Seeding admins is disabled in production!');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const createMultipleAdmins = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL!;
    const userRepository: UserRepository = new UserRepository();
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
    const numberOfAdminsStr = await askQuestion('How many admins do you want to create? ');
    const numberOfAdmins = parseInt(numberOfAdminsStr, 10);
    if (isNaN(numberOfAdmins) || numberOfAdmins <= 0) {
      console.error('Invalid number entered.');
      rl.close();
      process.exit(1);
    }

    for (let i = 1; i <= numberOfAdmins; i++) {
      console.log(`Admin ${i}:`);
      const mobileNumber = await askQuestion('Enter Admin Mobile Number: ');
      const plainPassword = await askQuestion('Enter Admin Password: ');
      if (!mobileNumber || !plainPassword) {
        console.error('Mobile number and password are required. Skipping...');
        continue;
      }
      const existingAdmin = await userRepository.get({ mobileNumber, userType: 'admin' });
      if (existingAdmin) {
        console.log('Admin already exists with mobileNumber:', existingAdmin.mobileNumber);
        continue; 
      }
      const hashedPassword = await bcrypt.hash(plainPassword, Number(process.env.SALT_ROUND)!);
      let registrationDate = new Date();
      const updatedRegistrationDate = new Date(
        Date.UTC(
          registrationDate.getUTCFullYear(),
          registrationDate.getUTCMonth(),
          registrationDate.getUTCDate()
        )
      );
      await userRepository.create({
        mobileNumber,
        hashedPassword,
        registrationDate: updatedRegistrationDate,
        teamMemberCount: 5,
        userType: UserType.ADMIN,
        permissions: [Permission.CREATE, Permission.READ, Permission.UPDATE, Permission.DELETE],
        isActive: true,
        forcePasswordReset: true,
        phoneCountryCode: 'N/A'
      });
      console.log(`Admin with mobile number ${mobileNumber} created.`);
    }
    console.log('All Admins processed successfully.');
    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admins:', error);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
};

createMultipleAdmins();
