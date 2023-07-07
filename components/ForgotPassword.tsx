import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from 'axios'

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

const ForgotPassword = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const handleGoBackToLoginClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    router.push("/Login");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = 'http://api.localhost/auth/forgot-password'
    try {
      const response = await axios.post(url, { email })
      if (response.status === 300) {
        setServerErrors(response.data.errors)
      }
    } catch (error) {
      console.error(error)
      setServerErrors(['An unexpected error occurred'])
    }
  }

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <TextInput
            label="Your email"
            placeholder="you@frro.utn.edu.ar"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor color="dimmed" size="sm" className={classes.control} onClick={handleGoBackToLoginClick}>
              <Center inline>
                <IconArrowLeft size={rem(12)} stroke={1.5} />
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Anchor>
            <Button className={classes.control} type="submit">
              Reset password
            </Button>
          </Group>
        </Paper>
      </form>
      {serverErrors?.length > 0 && (
        <div>
          {serverErrors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default ForgotPassword