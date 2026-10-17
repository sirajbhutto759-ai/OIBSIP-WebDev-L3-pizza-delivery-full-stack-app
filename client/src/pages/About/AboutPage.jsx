import { Link } from 'react-router-dom';
import { Award, Heart, ShieldCheck, Truck, Users, Sparkles, ChefHat } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <span className="hero-tag" style={{ background: 'rgba(230, 57, 70, 0.2)', color: 'var(--orange)', padding: '6px 16px', borderRadius: 20, display: 'inline-block', marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
            OUR PASSION &amp; HERITAGE
          </span>
          <h1>Crafting Pizza Perfection</h1>
          <p>
            From traditional Italian brick ovens to your doorstep — baked with authentic passion and the freshest ingredients.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section about-story-section">
        <div className="container story-grid">
          <div className="story-content">
            <span className="overline">How We Started</span>
            <h2>Born From a Love for Crispy Crusts &amp; Melting Mozzarella</h2>
            <p>
              PizzaHub was founded with a singular mission: to elevate the everyday pizza delivery experience into a gourmet culinary delight. We believe that convenience shouldn't mean sacrificing authentic taste or artisanal standards.
            </p>
            <p>
              Our dough is fermented slowly for 48 hours to create that signature airy, crispy crust with authentic blistered edges. We hand-crush San Marzano style plum tomatoes and top each pie with 100% whole-milk mozzarella and locally sourced herbs.
            </p>

            <div className="story-highlights">
              <div className="highlight-item">
                <div className="hl-icon"><Award size={20} /></div>
                <div>
                  <strong>Artisanal Quality</strong>
                  <span>Small-batch preparation guaranteed</span>
                </div>
              </div>
              <div className="highlight-item">
                <div className="hl-icon"><Truck size={20} /></div>
                <div>
                  <strong>Fast &amp; Steaming Hot</strong>
                  <span>Insulated thermal bags keep it oven-fresh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="story-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=800&q=80"
              alt="Pizza chef placing pizza in oven"
              className="story-img"
            />
            <div className="story-floating-card">
              <ChefHat size={32} className="chef-icon" />
              <div>
                <strong>Master Pizzaiolos</strong>
                <p>15+ years of combined wood-fired baking expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section values-section">
        <div className="container">
          <div className="section-header">
            <span className="overline">What Defines Us</span>
            <h2>Our Core Standards</h2>
            <p>Four pillars that guide every recipe and every delivery box.</p>
          </div>

          <div className="grid-4 values-grid">
            <div className="card value-card">
              <div className="value-icon"><Sparkles size={28} /></div>
              <h3>100% Real Cheese</h3>
              <p>Zero artificial blends or oil substitutes. Just pure, stretchable mozzarella goodness.</p>
            </div>
            <div className="card value-card">
              <div className="value-icon"><Heart size={28} /></div>
              <h3>Fresh Dough Daily</h3>
              <p>Made from scratch every single morning with premium unbleached flour.</p>
            </div>
            <div className="card value-card">
              <div className="value-icon"><ShieldCheck size={28} /></div>
              <h3>Strict Food Safety</h3>
              <p>Rigorous hygiene standards, contactless packaging, and temperature-controlled handling.</p>
            </div>
            <div className="card value-card">
              <div className="value-icon"><Truck size={28} /></div>
              <h3>30-Min Guarantee</h3>
              <p>Fast delivery tracking so you can enjoy your pizza bubbling hot and on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section about-cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Taste the Difference?</h2>
            <p>Explore our handcrafted selection of classic, spicy, cheesy, and gourmet specialty pizzas.</p>
            <div className="cta-buttons">
              <Link to="/menu" className="btn btn-primary btn-lg">Explore Menu</Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
