// src/pages/SabbathFooter.js
import React from 'react';
import './sabbathFooter.css';

function SabbathFooter() {
  return (
    <>
      {/* ── Page Wrapper ───────────────────────────────────── */}
      <div className="sabbath-page">
        <div className="pamphlet">
          {/* ── Header ─────────────────────────────────────── */}
          <header className="header">
            <div className="subtitle">NK-ORGANICS PRESENTS</div>
            <h1 className="main-title">Embrace the True Sabbath</h1>
            <p className="intro">
              At NK-Organics, we cherish the timeless gift of the true Sabbath —
              a day set apart by God for genuine rest, worship, and renewal.
              This sacred rhythm traces back to Creation, upheld by Jesus, and
              honored by the earliest Christians.
            </p>
          </header>

          {/* ── Biblical Foundations ───────────────────────── */}
          <div className="divider" />
          <section className="section">
            <h2 className="section-title">Biblical Foundations</h2>
            <div className="content">
              <article className="bible-point">
                <h3 className="point-title">Created and Sanctified by God</h3>
                <div className="verse">
                  “And on the seventh day God ended His work which He had made;
                  and He rested on the seventh day from all His work.”
                  <br />— Genesis 2 : 1-3
                </div>
                <p>
                  The Sabbath stands as a divine memorial of Godʼs creative
                  power and perfect design.
                </p>
              </article>

              <article className="bible-point">
                <h3 className="point-title">Godʼs Command for Rest</h3>
                <div className="verse">
                  “Remember the Sabbath day, to keep it holy.”
                  <br />— Exodus 20 : 8-11
                </div>
                <p>
                  The Sabbath is not a burden but a blessing — a divine
                  institution woven into Godʼs law for our benefit.
                </p>
              </article>
            </div>
          </section>

          {/* ── Jesus & the Sabbath ────────────────────────── */}
          <div className="divider" />
          <section className="section">
            <h2 className="section-title">Jesus and the True Sabbath</h2>
            <div className="content">
              <article className="bible-point">
                <h3 className="point-title">Jesus Observed the Sabbath</h3>
                <div className="verse">
                  “And He came to Nazareth, where He had been brought up: and,
                  as His custom was, He went into the synagogue on the Sabbath
                  day.”
                  <br />— Luke 4 : 16
                </div>
                <p>
                  Our Savior honored the Sabbath throughout His earthly
                  ministry, setting an example for all believers.
                </p>
              </article>

              <article className="bible-point">
                <h3 className="point-title">A Model of True Worship</h3>
                <div className="verse">
                  “The Sabbath was made for man, and not man for the Sabbath.”
                  <br />— Mark 2 : 27
                </div>
                <p>
                  Jesus showed that the Sabbath is a gift for restoration — a
                  time to renew body, mind, and spirit in communion with God.
                </p>
              </article>
            </div>
          </section>

          {/* ── Early Christians ───────────────────────────── */}
          <div className="divider" />
          <section className="section">
            <h2 className="section-title">Early Christian Observance</h2>
            <div className="content">
              <article className="bible-point">
                <h3 className="point-title">The Apostles &amp; Early Believers</h3>
                <div className="verse">
                  “And on the Sabbath we went out of the city by a river side,
                  where prayer was wont to be made.”
                  <br />— Acts 16 : 13
                </div>
                <p>
                  The earliest followers of Christ continued to honor the
                  seventh-day Sabbath as a testimony to Godʼs enduring law.
                </p>
              </article>

              <article className="bible-point">
                <h3 className="point-title">Paulʼs Regular Practice</h3>
                <div className="verse">
                  “And he reasoned in the synagogue <strong>every Sabbath</strong>,
                  and persuaded the Jews and the Greeks.”
                  <br />— Acts 18 : 4
                </div>
                <p>
                  Paulʼs weekly Sabbath worship underscores the New-Testament
                  continuity of the seventh day.
                </p>
              </article>
            </div>
          </section>

          {/* ── Invitation / Call-to-Action ───────────────── */}
          <div className="invitation">
            <h2 className="invitation-title">Our Invitation</h2>
            <p className="invitation-content">
              Join us each Saturday to step away from the rush, reconnect with
              our Creator, and experience true refreshment. Let this day of
              worship inspire you to:
            </p>

            <div className="benefits">
              <div className="benefit">
                Reflect on Godʼs creative order and rest in His promises
              </div>
              <div className="benefit">
                Embrace a lifestyle of renewal and fellowship
              </div>
              <div className="benefit">
                Enjoy our organic creations grown in natureʼs rhythm
              </div>
            </div>

            <div className="tagline">
              Experience Authentic Rest.
              <br />
              Embrace the True Sabbath.
            </div>
          </div>

          {/* ── Closing Banner ─────────────────────────────── */}
          <footer className="footer">
            NK-Organics – Nourishing Body, Mind, and Spirit
          </footer>
        </div>
      </div>

      {/* Spacer so global fixed footer doesn’t cover the banner */}
      <div className="footer-spacer" />
    </>
  );
}

export default SabbathFooter;