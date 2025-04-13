import { Resend } from 'resend';
import { render } from '@react-email/components';
import { BookingConfirmation } from '../emails/BookingConfirmation';
import * as React from 'react';

const resend = new Resend("re_RPwoeXNV_BNNU7MbWP194tc6uaSCQjNN5");

// Helper function to render email template
async function renderEmailTemplate(props) {
  const html = await render(React.createElement(BookingConfirmation, props), {
    pretty: true
  });
  return html;
}

export async function sendBookingConfirmation(bookingData, apaleoResponse) {
  console.log('Starting email sending process...');
  console.log('Input data:', { bookingData, apaleoResponse });

  try {
    const { cart } = bookingData;
    const { personalData, searchData } = cart;
    
    console.log('Extracted cart data:', { personalData, searchData });
    
    // Format dates nicely
    const formatDate = (dateStr) => {
      console.log('Formatting date:', dateStr);
      const formattedDate = new Date(dateStr).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      console.log('Formatted date:', formattedDate);
      return formattedDate;
    };

    // Prepare email data for the template
    console.log('Preparing email data...');
    const emailData = {
      bookingId: apaleoResponse.id,
      reservationNumber: apaleoResponse.reservationId,
      guestName: `${personalData.firstName} ${personalData.lastName}`,
      checkIn: formatDate(searchData.startDate),
      checkOut: formatDate(searchData.endDate),
      totalAmount: cart.calculatedAmounts.total.gross,
      deposit: cart.calculatedAmounts.Anzahlung.gross,
      numberOfAdults: searchData.adults,
      numberOfChildren: searchData.childrenAges?.length || 0,
      childrenAges: searchData.childrenAges || [],
      mainGuest: {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone,
        street: personalData.street,
        postalCode: personalData.zipCode,
        city: personalData.city,
        country: personalData.country
      },
      additionalGuests: personalData.additionalGuests?.map(guest => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        isChild: guest.isChild,
        age: guest.age
      })) || [],
      selectedOffer: cart.offer ? {
        title: cart.offer.Title
      } : null,
      selectedServices: cart.offer?.Services
        ?.filter(s => s.selected)
        .map(service => ({
          name: service.Name,
          price: service.Standardpreis,
          vat: service.Steuer
        })) || [],
      comments: personalData.comments,
      hotelName: "Hotel Stern",
      hotelAddress: "Marktplatz 2, 88316 Isny im Allgäu",
      hotelPhone: "+49 7562 97010",
      hotelEmail: "info@hotel-stern.de"
    };
    console.log('Prepared email data:', emailData);

    // Generate a plain text version for email clients that don't support HTML
    console.log('Generating plain text version...');
    const plainText = await render(React.createElement(BookingConfirmation, emailData), {
      plainText: true
    });
    console.log('Generated plain text version');

    console.log('Preparing to send email to:', personalData.email);
    
    try {
      console.log('Rendering React email template...');
      const html = await renderEmailTemplate(emailData);
      console.log('Successfully rendered HTML template');
      console.log('HTML Content Type:', typeof html);

      console.log('Sending email via Resend...');
      // Send the email with both HTML and plain text versions
      const { data, error } = await resend.emails.send({
        from: 'Hotel Stern <info@siriusmailer.com>',
        to: personalData.email,
        subject: `Booking Confirmation #${apaleoResponse.reservationId} - Hotel Stern`,
        html,
        text: plainText,
      });

      if (error) {
        console.error('Resend API error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          name: error.name,
          statusCode: error.statusCode
        });
        throw error;
      }

      console.log('Email sent successfully!');
      console.log('Resend response:', data);
    } catch (emailError) {
      console.error('Error during email sending process:', emailError);
      console.error('Error stack:', emailError.stack);
      console.error('Error details:', {
        name: emailError.name,
        message: emailError.message,
        code: emailError.code,
        response: emailError.response
      });
      throw emailError;
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    // Don't throw the error as we don't want to fail the booking if email fails
  }
}
