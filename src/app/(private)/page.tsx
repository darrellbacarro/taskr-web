'use client';

import AnimatedContainer from "@/lib/components/AnimatedContainer";
import { useAuth } from "@/lib/hooks/use-auth";
import { redirect } from 'next/navigation';
import { useEffect } from "react";

const IndexPage = () => {
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [loading, user]);

  if (loading) return (<div>Loading...</div>);

  return (
    <AnimatedContainer key={'index'}>
      <h1>Hello World</h1>
    </AnimatedContainer>
  );
};

export default IndexPage;
