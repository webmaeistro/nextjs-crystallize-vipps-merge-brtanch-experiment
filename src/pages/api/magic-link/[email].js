import jwt from 'jsonwebtoken';
import mjml2html from '@nerdenough/mjml-ncc-bundle';
import sgMail from '@sendgrid/mail';

import getHost from 'lib-api/util/get-host';

const secret = process.env.JWT_SECRET;
const sendGridApiKey = process.env.SENDGRID_API_KEY;

function getEmailHtml(loginLink) {
  const { html } = mjml2html(
    `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text> Velkommen til Ørn forlag login. Følg linken under, den er gyldig i 1 time</mj-text>
          <mj-button href="${loginLink}" align="center">Klikk her for å logge inn</mj-button>
          <mj-text>${loginLink}</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`,
    {}
  );

  return html;
}

export default async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'No email provided' });
  }

  const token = jwt.sign({ email }, secret, {
    expiresIn: '36000s'
  });

  const magicLink = `${getHost(req)}/api/verify?token=${token}`;

  // Here we would want to check whether a user already exists with the email
  // provided. This boilerplate does not have a datastore connected to it yet
  // so we will assume that the user exists. If the user doesn't exist this
  // would also be a good place to create the new user.
  //
  // The token should also be saved somewhere so that we can verify that it
  // is a valid token in `./verify.js`.

  const html = getEmailHtml(magicLink);

  // Now that we have an email formatted to contain the magic link we want to
  // send it. If configured to use SendGrid, an email will be sent with the
  // login link. If not, the link will be logged to console.
  if (sendGridApiKey) {
    sgMail.setApiKey(sendGridApiKey);
    await sgMail.send({
      to: email,
      from: 'webmaster@ornforlag.no',
      subject: 'Ornforlag.no magisk link',
      html
    });
  } else {
    return res.json({
      message: 'Epost sendt! Denne linken er gyldig i 1 time fra og med nå',
      magicLink
    });
  }

  return res.json({
    message: 'Epost sendt! Denne linken er gyldig i 1 time fra og med nå'
  });
};
