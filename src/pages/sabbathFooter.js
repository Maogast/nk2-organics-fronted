// src/pages/sabbathFooter.js
import React from 'react';
import './sabbathFooter.css';

function sabbathFooter() {
  return (
    <>
      {/* ① page wrapper */}
      <div className="sabbath-page">
        <div className="pamphlet">
          {/* ——— header ——— */}
          <div className="header">
            <div className="subtitle">NK-ORGANICS PRESENTS</div>
            <h1 className="main-title">Embrace the True Sabbath</h1>
            <p className="intro">
              At NK-Organics, we cherish the timeless gift of the true Sabbath—a
              day set apart by God for genuine rest, worship, and renewal. This
              sacred rhythm traces back to Creation, upheld by Jesus, and
              honored by the earliest Christians.
            </p>
          </div>

          {/* ——— biblical foundations ——— */}
          <div className="divider" />
          <div className="section">
            <h2 className="section-title">Biblical Foundations</h2>
            <div className="content">
              <div className="bible-point">
                <h3 className="point-title">Created and Sanctified by God</h3>
                <div className="verse">
                  &quot;And on the seventh day God ended His work which He had
                  made; and He rested on the seventh day from all His
                  work.&quot;
                  <br />– Genesis 2:1-3
                </div>
                <p>
                  The Sabbath stands as a divine memorial of God&apos;s creative
                  power and perfect design.
                </p>
              </div>

              <div className="bible-point">
                <h3 className="point-title">God&apos;s Command for Rest</h3>
                <div className="verse">
                  &quot;Remember the Sabbath day, to keep it holy.&quot;
                  <br />– Exodus 20:8-11
                </div>
                <p>
                  The Sabbath is not a burden but a blessing—a divine
                  institution woven into God&apos;s law for our benefit.
                </p>
              </div>
            </div>
          </div>

          {/* ——— Jesus & the Sabbath ——— */}
          <div className="divider" />
          <div className="section">
            <h2 className="section-title">Jesus and the True Sabbath</h2>
            <div className="content">
              <div className="bible-point">
                <h3 className="point-title">Jesus Observed the Sabbath</h3>
                <div className="verse">
                  &quot;And he came to Nazareth, where he had been brought up:
                  and, as his custom was, he went into the synagogue on the
                  sabbath day.&quot;
                  <br />– Luke 4:16
                </div>
                <p>
                  Our Savior honored the Sabbath throughout His earthly
                  ministry, setting an example for all believers.
                </p>
              </div>

              <div className="bible-point">
                <h3 className="point-title">A Model of True Worship</h3>
                <div className="verse">
                  &quot;The sabbath was made for man, and not man for the
                  sabbath.&quot;
                  <br />– Mark 2:27
                </div>
                <p>
                  Jesus showed that the Sabbath is a gift for restoration—a time
                  to renew body, mind, and spirit in communion with God.
                </p>
              </div>
            </div>
          </div>

          {/* ——— Early Christians ——— */}
          <div className="divider" />
          <div className="section">
            <h2 className="section-title">Early Christian Observance</h2>
            <div className="content">
              <div className="bible-point">
                <h3 className="point-title">
                  The Apostles &amp; Early Believers
                </h3>
                <div className="verse">
                  &quot;And on the sabbath we went out of the city by a river
                  side, where prayer was wont to be made.&quot;
                  <br />– Acts 16:13
                </div>
                <p>
                  The earliest followers of Christ continued to honor the
                  seventh-day Sabbath as a testimony to God&apos;s enduring law.
                </p>
              </div>

              <div className="bible-point">
                <h3 className="point-title">A Tradition of Faith</h3>
                <div className="verse">
                  &quot;And upon the first day of the week, when the disciples
                  came together to break bread…&quot;
                  <br />– Acts 20:7
                </div>
                <p>
                  For millennia, God&apos;s people have set aside the seventh
                  day—a sacred practice that remains a symbol of His eternal
                  covenant.
                </p>
              </div>
            </div>
          </div>

          {/* ——— Call-to-action ——— */}
          <div className="invitation">
            <h2 className="invitation-title">Our Invitation</h2>
            <p className="invitation-content">
              Join us each Saturday to step away from the rush, reconnect with
              our Creator, and experience true refreshment. Let this day of
              worship inspire you to:
            </p>

            <div className="benefits">
              <div className="benefit">
                Reflect on God&apos;s creative order and rest in His promises
              </div>
              <div className="benefit">
                Embrace a lifestyle of renewal and fellowship
              </div>
              <div className="benefit">
                Enjoy our organic creations grown in nature&apos;s rhythm
              </div>
            </div>

            <div className="tagline">
              Experience Authentic Rest.
              <br />
              Embrace the True Sabbath.
            </div>
          </div>

          {/* ——— closing banner ——— */}
          <div className="footer">
            NK-Organics – Nourishing Body, Mind, and Spirit
          </div>
        </div>
      </div>

      {/* ② invisible spacer = footer height */}
      <div className="footer-spacer" />
    </>
  );
}

export default sabbathFooter;