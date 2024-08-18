import React from 'react'
import { Badge, Card, Flex, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const TermsConditions = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  const contact = 'team120@gmail.com'

  return (
    <Card
      shadow="sm"
      my="4rem"
      mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
      p="lg"
      radius="md"
      withBorder>
      <Card.Section p="1rem">
        <Flex justify="center">
          <Image
            src="/android-chrome-512x512.png"
            h="200"
            w="auto"
            alt="Universiteams logo"
            p="rem"
            radius="md"
          />
        </Flex>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="xl">Terms & Conditions</Text>
        <Badge color="pink">Legal info</Badge>
      </Group>

      <Card.Section p="1rem">
        <Group justify="space-between" mt="md" mb="xs">
          <Text size="lg">Universiteams - Terms and Conditions</Text>
          <Badge color="orange.8">Last updated: 17/08/2024</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          Welcome to Universiteams! These Terms and Conditions ("Terms") govern your use of the
          Universiteams application ("App"), owned and operated by "Team120" (GitHub Organization).
          By accessing or using the App, you agree to be bound by these Terms. If you do not agree
          to these Terms, you may not use the App.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">1. Acceptance of Terms</Text>
        <Text size="sm" c="dimmed">
          By registering, accessing, or using the App, you acknowledge that you have read,
          understood, and agree to be bound by these Terms and all applicable laws and regulations.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">2. Eligibility</Text>
        <Text size="sm" c="dimmed">
          To use Universiteams, you must be a student, faculty member, or affiliated with a
          university or educational institution. By using the App, you represent and warrant that
          you meet these eligibility requirements.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">3. Account Registration</Text>
        <Text size="sm" c="dimmed">
          To access certain features of the App, you may be required to create an account. You agree
          to provide accurate, current, and complete information during the registration process and
          to update such information to keep it accurate, current, and complete. You are responsible
          for safeguarding your account credentials and for all activities that occur under your
          account.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">4. Use of the App</Text>
        <Text size="sm" c="dimmed">
          - Creating Projects: Users may create and manage university-related projects. You are
          responsible for the content and accuracy of the project information you provide.
        </Text>
        <Text size="sm" c="dimmed">
          - Searching Projects: Users can search for university projects. Universiteams does not
          guarantee the availability, quality, or relevance of any projects listed on the App.
        </Text>
        <Text size="sm" c="dimmed">
          - Enrolling in Projects: Users may apply to join projects listed on the App. Acceptance
          into a project is at the sole discretion of the project creator or manager.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">5. User Conduct</Text>
        <Text size="sm" c="dimmed">
          You agree to use the App only for lawful purposes. You are prohibited from:
        </Text>
        <Text size="sm" c="dimmed">
          - Posting false, misleading, or inappropriate content.
        </Text>
        <Text size="sm" c="dimmed">
          - Impersonating another person or entity.
        </Text>
        <Text size="sm" c="dimmed">
          - Engaging in any activity that could disrupt or interfere with the App's functionality.
        </Text>
        <Text size="sm" c="dimmed">
          - Collecting personal data from other users without their consent.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">6. Content Ownership and License</Text>
        <Text size="sm" c="dimmed">
          - User Content: You retain ownership of any content you submit, post, or display on the
          App. By posting content, you grant Universiteams a non-exclusive, worldwide, royalty-free
          license to use, display, and distribute your content on the App.
        </Text>
        <Text size="sm" c="dimmed">
          - App Content: All other content provided on the App, including text, graphics, logos, and
          software, is owned by Universiteams or its licensors and is protected by intellectual
          property laws.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">7. Privacy Policy</Text>
        <Text size="sm" c="dimmed">
          At Universiteams, we value your privacy. We collect personal information such as your
          name, email address, and university affiliation when you create an account, as well as
          data on how you use the app. This information helps us manage your account, facilitate
          project participation, and improve our services. We also collect device information like
          your IP address to enhance your experience.
        </Text>
        <Text size="sm" c="dimmed">
          We may share your information with other users when you engage in projects and with
          trusted service providers who help us operate the app. Your data may also be disclosed if
          required by law. We take security seriously and use measures to protect your information,
          though no system is completely secure.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">8. Termination</Text>
        <Text size="sm" c="dimmed">
          Universiteams reserves the right to suspend or terminate your account or access to the App
          at any time, with or without cause, and with or without notice.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">9. Disclaimers</Text>
        <Text size="sm" c="dimmed">
          - The App is provided on an "as is" and "as available" basis. Universiteams makes no
          warranties, express or implied, regarding the App's operation, availability, or content.
        </Text>
        <Text size="sm" c="dimmed">
          - Universiteams is not responsible for the actions or content of users or third parties on
          the App.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">10. Limitation of Liability</Text>
        <Text size="sm" c="dimmed">
          To the fullest extent permitted by law, Universiteams shall not be liable for any direct,
          indirect, incidental, special, or consequential damages arising out of or in connection
          with your use of the App.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">11. Indemnification</Text>
        <Text size="sm" c="dimmed">
          You agree to indemnify and hold harmless Universiteams, its affiliates, and their
          respective officers, directors, employees, and agents from any claims, liabilities,
          damages, or expenses arising from your use of the App or violation of these Terms.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">12. Governing Law</Text>
        <Text size="sm" c="dimmed">
          These Terms are governed by and construed in accordance with the laws of Argentina,
          without regard to its conflict of law principles.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">13. Changes to Terms</Text>
        <Text size="sm" c="dimmed">
          Universiteams reserves the right to modify these Terms at any time. We will notify you of
          any changes by posting the updated Terms on the App. Your continued use of the App after
          any changes constitutes your acceptance of the new Terms.
        </Text>
      </Card.Section>

      <Card.Section p="1rem">
        <Text size="lg">14. Contact Information</Text>
        <Text size="sm" c="dimmed">
          If you have any questions or concerns about these Terms, please contact us at {contact}.
        </Text>
      </Card.Section>
    </Card>
  )
}

export default TermsConditions
