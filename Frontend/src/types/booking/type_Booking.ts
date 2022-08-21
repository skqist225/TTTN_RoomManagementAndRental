export interface IBooking {
    bookingId: number;
    roomId: number;
    roomName: string;
    roomThumbnail: string;
    bookingDate: string;
    cancelDate: string;
    checkinDate: string;
    checkoutDate: string;
    pricePerDay: number;
    numberOfDays: number;
    siteFee: number;
    refundPaid: number;
    state: string;
    refund: boolean;
    customerName: string;
    customerAvatar: string;
    roomCurrency: string;
}

export interface IBookingOrder {
    id: number;
    bookingDate: string;
    bookingDetails: BookingDetail[];
    hostId: number;
    hostFullName: number;
    totalPrice: number;
    state: string;
}

export interface BookingDetail {
    bookingDetailId: number;
    bookingId: number;
    roomId: number;
    roomName: string;
    roomThumbnail: string;
    roomCurrency: string;
    state: string;
    bookingDate: string;
    checkinDate: string;
    checkoutDate: string;
    pricePerDay: number;
    numberOfDays: number;
    siteFee: number;
    cleanFee: number;
    refundPaid: number;
    totalFee: number;
    customerName: string;
    customerAvatar: string;
    roomHostName: string;
    roomHostAvatar: string;
    numberOfReviews: number;
    averageRating: number;
    roomCategory: string;
}
