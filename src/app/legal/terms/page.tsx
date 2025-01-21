import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>Last Updated: January 21, 2024</h2>

          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using MindMapAI, you agree to be bound by these Terms of Service.</p>

          <h3>2. Description of Service</h3>
          <p>MindMapAI is a web-based mind mapping application that allows users to create, edit, and share mind maps.</p>

          <h3>3. User Accounts</h3>
          <ul>
            <li>You must maintain the security of your account</li>
            <li>You are responsible for all activities under your account</li>
            <li>You must be 13 years or older to use this service</li>
          </ul>

          <h3>4. User Content</h3>
          <ul>
            <li>You retain ownership of your mind maps</li>
            <li>You grant us license to host and share your content</li>
            <li>You are responsible for your content</li>
          </ul>

          <h3>5. Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on others&apos; intellectual property rights</li>
            <li>Share harmful or malicious content</li>
            <li>Attempt to breach our security measures</li>
          </ul>

          <h3>6. Service Modifications</h3>
          <p>We reserve the right to modify or discontinue the service at any time.</p>

          <h3>7. Limitation of Liability</h3>
          <p>We provide the service &quot;as is&quot; without any warranties.</p>

          <h3>8. Contact Information</h3>
          <p>For any questions regarding these terms, please contact:</p>
          <p>Email: sharjidh2003@gmail.com</p>
        </CardContent>
      </Card>
    </div>
  )
}
