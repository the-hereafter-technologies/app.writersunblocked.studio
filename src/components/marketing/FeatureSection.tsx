'use client'

import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 24px 72px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.article`
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  padding: 20px;
`

const Head = styled.h3`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.brand.black};
  margin-bottom: 8px;
`

const Text = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.92rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.palette.brand.black};
`

export default function FeatureSection() {
  return (
    <Section>
      <Grid>
        <Card>
          <Head>Character-forward intelligence</Head>
          <Text>Your prose becomes evidence. The system updates each character's desire, fear, and momentum from what they actually do on the page.</Text>
        </Card>
        <Card>
          <Head>PEC simulation engine</Head>
          <Text>When stuck, run a two-pass simulation that collides trajectories and filters weak options against character consistency.</Text>
        </Card>
        <Card>
          <Head>Paper-first writing surface</Head>
          <Text>A calm editor designed for long-form focus, with soft UI chrome and just enough structure around your draft.</Text>
        </Card>
      </Grid>
    </Section>
  )
}
