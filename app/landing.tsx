'use client';
import { useEffect } from 'react';

export function Wordmark() {
  return <span className="wordmark">kinora<span className="coordinate-mark" aria-hidden="true">＋</span></span>;
}

export default function Landing() {
  // Preserve links shared before the board moved to /app/ on static hosts too.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('source') || params.has('community')) window.location.replace(`/app/${window.location.search}${window.location.hash}`);
  }, []);
  return <div className="landing">
    <a className="skip" href="#landing-content">Skip to content</a>
    <header className="landing-header"><a href="/" aria-label="Kinora home"><Wordmark/></a><nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="/app/">Communities</a></nav><a className="primary" href="/app/">Open app <span aria-hidden="true">↗</span></a></header>
    <main id="landing-content">
      <section className="landing-hero">
        <div className="landing-intro"><p className="utility">Global tech communities<br/>For an open tomorrow</p><h1>Find your <mark>people.</mark><br/>Build what’s next.</h1><p className="landing-description">Gatherings and open calls for communities building in the open.</p><a className="primary" href="/app/">Explore communities <span aria-hidden="true">↗</span></a><p className="network-note">Built on Arkiv · Tiramisu testnet</p></div>
        <div className="ticket-stage" aria-label="Illustrative preview of community publications">
          <div className="orbit orbit-one" aria-hidden="true"/><div className="orbit orbit-two" aria-hidden="true"/>
          <span className="ticket-coordinate">One board.<br/>More than one way in.</span>
          <a href="/app/?source=demo" className="hero-ticket dark-ticket"><span className="utility">Illustrative event / Online</span><span className="ticket-place">LOCAL IDEAS ↔ GLOBAL CONNECTIONS</span><strong>Open source<br/>after hours</strong><div className="bracket-art" aria-hidden="true">[↗]</div><span className="ticket-bottom">Talks. Build. Connect. <span>Explore examples ↗</span></span></a>
          <a href="/app/?source=demo" className="hero-ticket light-ticket"><span className="utility">Illustrative open call</span><strong>Public goods.<br/>Open invitations.</strong><span className="ticket-bottom">Ideas / Code / Design <span>↗</span></span></a>
        </div>
      </section>
      <section className="landing-discover" aria-labelledby="discover-heading"><div className="section-heading"><div><p className="utility">Find your starting point</p><h2 id="discover-heading">Different time zones.<br/>Shared ambition.</h2></div><a className="text-link" href="/app/">Explore the board ↗</a></div><div className="discovery-grid"><a href="/app/?source=demo&community=builders-sur"><span>01 / Technology</span><h3>Build<br/>in the open.</h3><span>Southern Builders ↗</span></a><a href="/app/?source=demo&community=estudio-abierto"><span>02 / Design</span><h3>Meet across<br/>disciplines.</h3><span>Open Studio ↗</span></a><a href="/app/?source=demo&community=jardin-publico"><span>03 / Public goods</span><h3>Make something<br/>that matters.</h3><span>Public Garden ↗</span></a></div><p className="network-note">Explore synthetic examples. Community names here belong to the demo.</p></section>
      <section className="landing-how" id="how-it-works"><div><p className="utility">Your community. Your data.</p><h2>A shared board.<br/>An open way in.</h2><a className="text-link" href="/reader/">Try the reference reader ↗</a></div><div className="how-steps"><article><span>01</span><div><h3>Find your people</h3><p>Browse gatherings and open calls. Reading doesn’t require a wallet.</p></div></article><article><span>02</span><div><h3>Put an idea out there</h3><p>Register a community, authorize organizers and publish with your wallet on Tiramisu using test GLM.</p></div></article><article><span>03</span><div><h3>Take another way in</h3><p>Read the same active publications through a separate client querying Arkiv directly. Publications expire at their declared end time.</p></div></article></div></section>
      <section className="landing-close"><p className="utility">A place to start something</p><h2>Find your people.<br/>Meet on Kinora.</h2><a className="primary" href="/app/">Open the board ↗</a></section>
    </main><footer><a href="/" aria-label="Kinora home"><Wordmark/></a><span>Arkiv hackathon prototype<br/>Tiramisu testnet · Synthetic content</span><a href="/reader/">Open reader ↗</a></footer>
  </div>;
}
