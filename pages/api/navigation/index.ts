import prisma from '../../../lib/prisma';

// POST /api/navigation
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body;  
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
    },
  });
  res.json(result);
}
