import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"; // fallback for dev

export const VerificationEmail = ({
  username,
  otp,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/logo.png`}
          width="42"
          height="42"
          alt="Brand Logo"
          style={logo}
        />
        <Heading style={heading}>Hello, {username} 👋</Heading>
        <Text style={paragraph}>
          Here is your verification code. It's valid for the next 5 minutes.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={`${baseUrl}/verify?otp=${otp}`}>
            Use Code
          </Button>
        </Section>
        <Text style={paragraph}>
          If the button doesn't work, use this code manually:
        </Text>
        <code style={code}>{otp}</code>
        <Hr style={hr} />
        <Link href="https://yourwebsite.com" style={reportLink}>
          Visit our website
        </Link>
      </Container>
    </Body>
  </Html>
);

VerificationEmail.PreviewProps = {
  username: "John Doe",
  otp: "123456",
} as VerificationEmailProps;

export default VerificationEmail;

// Styles
const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};


// import {
//   Html,
//   Head,
//   Font,
//   Preview,
//   Heading,
//   Row,
//   Section,
//   Text,
//   Button,
// } from '@react-email/components';

// interface VerificationEmailProps {
//   username: string;
//   otp: string;
// }

// export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
//   return (
//     <Html lang="en" dir="ltr">
//       <Head>
//         <title>Verification Code</title>
//         <Font
//           fontFamily="Roboto"
//           fallbackFontFamily="Verdana"
//           webFont={{
//             url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
//             format: 'woff2',
//           }}
//           fontWeight={400}
//           fontStyle="normal"
//         />
//       </Head>
//       <Preview>Here&apos;s your verification code: {otp}</Preview>
//       <Section>
//         <Row>
//           <Heading as="h2">Hello {username},</Heading>
//         </Row>
//         <Row>
//           <Text>
//             Thank you for registering. Please use the following verification
//             code to complete your registration:
//           </Text>
//         </Row>
//         <Row>
//           <Text>{otp}</Text> 
//         </Row>
//         <Row>
//           <Text>
//             If you did not request this code, please ignore this email.
//           </Text>
//         </Row>
//         {/* <Row>
//           <Button
//             href={`http://localhost:3000/verify/${username}`}
//             style={{ color: '#61dafb' }}
//           >
//             Verify here
//           </Button>
//         </Row> */}
//       </Section>
//     </Html>
//   );
// }