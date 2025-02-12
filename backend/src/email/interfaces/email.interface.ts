export interface BookingConfirmationEmailData {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  bookingDetails: {
    id: string;
    dateTime: Date;
    totalAmount: number;
    depositAmount: number;
    status: string;
    paymentStatus: string;
    serviceName: string;
    addOnServices: Array<{
      name: string;
      price: number;
    }>;
  };
} 