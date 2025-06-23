import { GetServerSideProps } from 'next';

export default function RedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const API_URL = process.env.API_URL;
  const res = await fetch(`${API_URL}/${slug}`, { redirect: 'manual' });
  if (res.status === 302) {
    const url = res.headers.get('location') || '/';
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  }
  return { notFound: true };
};