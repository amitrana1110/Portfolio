// Encode each value separately so user input cannot become URL parameters.
const query = (values) => Object.entries(values)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&');

export function gmailDraft({ recipient, name, email, type, message }, userAgent = '') {
  const subject = `Portfolio enquiry: ${type}`;
  const body = `Hi Amit,\n\n${message.trim()}\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nEnquiry type: ${type}`;
  const web = `https://mail.google.com/mail/?${query({ view: 'cm', fs: '1', to: recipient, su: subject, body })}`;
  let app = web;
  if (/Android/i.test(userAgent)) {
    app = `intent:${encodeURIComponent(recipient)}?${query({ subject, body })}#Intent;scheme=mailto;action=android.intent.action.SENDTO;package=com.google.android.gm;S.browser_fallback_url=${encodeURIComponent(web)};end`;
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    app = `googlegmail:///co?${query({ to: recipient, subject, body })}`;
  }
  return { web, app };
}
