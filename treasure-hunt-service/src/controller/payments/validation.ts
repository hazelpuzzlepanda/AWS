import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

// const fullNameRegex = /^[A-Za-z\s'-]{2,50}$/;
export const createBookingSchema = yup.object().shape({
  mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .test(
      'is-valid-phone',
      'Enter a valid mobile number (e.g., +919876543210)',
      value => !!value && isValidPhoneNumber(value)
    ),

  registrationDate: yup
    .date()
    .required('Registration date is required'),

  teamMemberCount: yup
    .number()
    .required('Number of participants is required')
    .min(2, 'Minimum 2 participants are required'),
  amount: yup.number().required('Amount is required').min(1, 'Amount cannot be negative or zero'),
  fullName: yup.string().required('Full name is required')
});

