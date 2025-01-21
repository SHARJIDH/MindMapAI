import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>Last Updated: January 21, 2024</h2>
          
          <h3>1. Introduction</h3>
          <p>Welcome to MindMapAI. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

          <h3>2. Information We Collect</h3>
          <ul>
            <li>Email address (through Google Sign-in)</li>
            <li>Basic profile information</li>
            <li>Mind map content you create</li>
            <li>Usage data and analytics</li>
          </ul>

          <h3>3. How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To authenticate your identity</li>
            <li>To save and manage your mind maps</li>
            <li>To improve our service</li>
          </ul>

          <h3>4. Data Storage and Security</h3>
          <p>Your data is stored securely on AWS servers. We implement industry-standard security measures to protect your information.</p>

          <h3>5. Third-Party Services</h3>
          <p>We use the following third-party services:</p>
          <ul>
            <li>Google Authentication</li>
            <li>Amazon Web Services (AWS)</li>
            <li>Vercel (hosting)</li>
          </ul>

          <h3>6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request data deletion</li>
            <li>Export your mind maps</li>
            <li>Opt-out of communications</li>
          </ul>

          <h3>7. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: sharjidh2003@gmail.com</p>
        </CardContent>
      </Card>
    </div>
  )
}
