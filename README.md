# **MindMapAI**

**MindMapAI** is an AI-driven concept map creator designed to simplify and deepen your understanding of any topic. It generates nodes with content powered by an LLM, connected through edges to visually represent relationships. The tool provides multiple perspectives, guiding learners from basic concepts to advanced insights. Perfect for students, educators, and professionals, it transforms complex topics into clear, interactive maps.

## Features

* Generating data with LLM
* Fetch YouTube Videos related to the topics/subjects
* Generates Blogs, Essays and summaries
* Helps to provide valuable insights regarding the subject

## Tech Stack

* [Next.js](https://nextjs.org)
* [React Flow](https://reactflow.dev/)
* [PostgreSQL](https://postgres.org)
* [X AI](https://console.x.ai/)
* [Prisma](https://www.prisma.io/)
* [Recoil](https://recoiljs.org)
* [Authjs](https://authjs.dev/)

## Installation

1. Clone the repository:
   

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY
   XAI_API_KEY
   DATABASE_URL
   AUTH_SECRET
   AUTH_GOOGLE_SECRET
   AUTH_GOOGLE_ID
   AUTH_GITHUB_SECRET
   AUTH_GITHUB_ID
   ```

4. Run database migration:
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
#   M i n d M a p A I  
 