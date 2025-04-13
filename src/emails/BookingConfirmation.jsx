import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const BookingConfirmation = ({
  bookingId,
  reservationNumber,
  guestName,
  checkIn,
  checkOut,
  totalAmount,
  deposit,
  numberOfAdults,
  numberOfChildren,
  childrenAges,
  mainGuest,
  additionalGuests,
  selectedOffer,
  selectedServices,
  comments,
  hotelName = "Hotel Stern",
  hotelAddress = "Sample Street 123, 12345 City",
  hotelPhone = "+49 123 456789",
  hotelEmail = "info@hotel-stern.de",
}) => (
  <Html>
    <Head />
    <Preview>Your booking confirmation #{reservationNumber} - {hotelName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Img
            src="https://res.cloudinary.com/dgyarghwg/image/upload/v1735740856/sirius/common/highlight_aw1egj.png"
            width="600"
            style={{ width: '100%', height: 'auto' }}
            alt={hotelName}
          />
        </Section>

        {/* Success Banner */}
        <Section style={successBanner}>
          <Heading style={successHeading}>Booking Confirmed!</Heading>
          <Text style={successText}>Thank you for choosing {hotelName}</Text>
        </Section>

        {/* Booking References */}
        <Row style={twoColumnRow}>
          <Column style={column}>
            <Section style={card}>
              <Text style={labelText}>Booking ID</Text>
              <Text style={valueText}>{bookingId}</Text>
            </Section>
          </Column>
          <Column style={column}>
            <Section style={card}>
              <Text style={labelText}>Reservation Number</Text>
              <Text style={valueText}>{reservationNumber}</Text>
            </Section>
          </Column>
        </Row>

        {/* Stay Details */}
        <Section style={sectionCard}>
          <Heading style={sectionHeading}>Stay Details</Heading>
          <Row style={detailsRow}>
            <Column style={column}>
              <Text style={labelText}>Check-in</Text>
              <Text style={valueText}>{checkIn}</Text>
            </Column>
            <Column style={column}>
              <Text style={labelText}>Check-out</Text>
              <Text style={valueText}>{checkOut}</Text>
            </Column>
          </Row>
          <Row style={detailsRow}>
            <Column style={column}>
              <Text style={labelText}>Adults</Text>
              <Text style={valueText}>{numberOfAdults}</Text>
            </Column>
            {numberOfChildren > 0 && (
              <Column style={column}>
                <Text style={labelText}>Children</Text>
                <Text style={valueText}>
                  {numberOfChildren} ({childrenAges.join(', ')} years)
                </Text>
              </Column>
            )}
          </Row>
        </Section>

        {/* Guest Information */}
        <Section style={sectionCard}>
          <Heading style={sectionHeading}>Guest Information</Heading>
          <Text style={subHeading}>Main Guest</Text>
          <Row style={detailsRow}>
            <Column style={column}>
              <Text style={labelText}>Name</Text>
              <Text style={valueText}>{mainGuest.firstName} {mainGuest.lastName}</Text>
            </Column>
            <Column style={column}>
              <Text style={labelText}>Email</Text>
              <Text style={valueText}>{mainGuest.email}</Text>
            </Column>
          </Row>
          <Row style={detailsRow}>
            <Column style={column}>
              <Text style={labelText}>Phone</Text>
              <Text style={valueText}>{mainGuest.phone}</Text>
            </Column>
            <Column style={column}>
              <Text style={labelText}>Address</Text>
              <Text style={valueText}>
                {mainGuest.street}
                <br />
                {mainGuest.postalCode} {mainGuest.city}
                <br />
                {mainGuest.country}
              </Text>
            </Column>
          </Row>

          {additionalGuests?.length > 0 && (
            <>
              <Hr style={divider} />
              <Text style={subHeading}>Additional Guests</Text>
              {additionalGuests.map((guest, index) => (
                <Text key={index} style={guestText}>
                  {guest.isChild ? 'Child' : 'Adult'} {index + 2}: {guest.firstName} {guest.lastName}
                  {guest.isChild && ` (${guest.age} years)`}
                </Text>
              ))}
            </>
          )}
        </Section>

        {/* Selected Offer */}
        <Section style={sectionCard}>
          <Heading style={sectionHeading}>Your Booking</Heading>
          <Text style={valueText}>{selectedOffer.title}</Text>
          
          {selectedServices?.length > 0 && (
            <>
              <Text style={subHeading}>Selected Services</Text>
              {selectedServices.map((service, index) => (
                <Text key={index} style={serviceText}>
                  • {service.name} - €{service.price}
                  <Text style={vatText}>
                    (incl. {service.vat}% VAT)
                  </Text>
                </Text>
              ))}
            </>
          )}
        </Section>

        {/* Price Summary */}
        <Section style={sectionCard}>
          <Heading style={sectionHeading}>Price Summary</Heading>
          <Row style={priceRow}>
            <Column style={column}>
              <Text style={labelText}>Total Amount</Text>
            </Column>
            <Column style={column}>
              <Text style={priceText}>€{totalAmount}</Text>
            </Column>
          </Row>
          <Row style={priceRow}>
            <Column style={column}>
              <Text style={labelText}>Deposit Required</Text>
            </Column>
            <Column style={column}>
              <Text style={depositText}>€{deposit}</Text>
            </Column>
          </Row>
        </Section>

        {comments && (
          <Section style={sectionCard}>
            <Heading style={sectionHeading}>Your Comments</Heading>
            <Text style={commentText}>{comments}</Text>
          </Section>
        )}

        {/* Hotel Information */}
        <Section style={footerCard}>
          <Text style={footerHeading}>Contact Information</Text>
          <Text style={footerText}>
            {hotelName}<br />
            {hotelAddress}<br />
            Phone: {hotelPhone}<br />
            Email: {hotelEmail}
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerSmall}>
            This is an automated email. Please do not reply directly to this message.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  padding: '20px',
  textAlign: 'center',
};

const successBanner = {
  backgroundColor: '#4ade80',
  borderRadius: '8px',
  padding: '32px 20px',
  marginBottom: '24px',
  textAlign: 'center',
};

const successHeading = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  padding: '0',
};

const successText = {
  color: '#ffffff',
  fontSize: '18px',
  margin: '0',
};

const twoColumnRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '24px',
};

const column = {
  width: '48%',
};

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const sectionCard = {
  ...card,
  marginBottom: '24px',
};

const sectionHeading = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
};

const subHeading = {
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: '600',
  margin: '16px 0 8px',
};

const labelText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 4px',
};

const valueText = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0',
  fontWeight: '500',
};

const detailsRow = {
  marginBottom: '16px',
};

const divider = {
  borderTop: '1px solid #e5e7eb',
  margin: '20px 0',
};

const guestText = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '4px 0',
};

const serviceText = {
  color: '#1f2937',
  fontSize: '14px',
  margin: '8px 0',
};

const vatText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
};

const priceRow = {
  marginBottom: '8px',
};

const priceText = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'right',
};

const depositText = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'right',
};

const commentText = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
};

const footerCard = {
  backgroundColor: '#1f2937',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  color: '#ffffff',
};

const footerHeading = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const footerText = {
  color: '#e5e7eb',
  fontSize: '14px',
  margin: '0',
  lineHeight: '22px',
};

const footer = {
  textAlign: 'center',
  padding: '0 20px',
};

const footerSmall = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
};

export default BookingConfirmation;
