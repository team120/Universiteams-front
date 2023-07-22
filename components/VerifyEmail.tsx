import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader, Card, Text, Button } from "@mantine/core";
import axios from "axios";

const VerifyEmail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = router.query.token as string;
      const url = `http://api.localhost/auth/verify-email`;
      try {
        const response = await axios.post(url, { verificationToken: token }, { withCredentials: true });
        if (response.status === 200) {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    verifyEmail();
  }, [router.query.token]);

  const handleGoHomeClick = () => {
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {isLoading && <Loader />}
      {!isLoading && (
        <Card shadow="sm" padding="lg" radius="md">
          <Text size="lg" weight={500}>
            {isSuccess ? 'Email verified successfully!' : "Email couldn't be verified."}
          </Text>
          <Button variant="outline" color="blue" onClick={handleGoHomeClick} style={{ marginTop: '1rem' }}>
            Go to home page
          </Button>
        </Card>
      )}
    </div>
  );
};

export default VerifyEmail;
