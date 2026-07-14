
export const privacyPolicy = (
  <>
    <h3>Privacy Policy</h3>
    <p>Your privacy is important to us. It is LifeFlow's policy to respect your privacy regarding any information we may collect from you across our application.</p>
    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
    <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
    <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
    <p>Our application may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
    <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
    <p>Your continued use of our application will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
    <p>This policy is effective as of 15 July 2026.</p>
  </>
);

export const termsOfService = (
  <>
    <h3>Terms of Service</h3>
    <p>By accessing the application LifeFlow, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
    <p>If you do not agree with any of these terms, you are prohibited from using or accessing this application. The materials contained in this application are protected by applicable copyright and trademark law.</p>
    <p>Permission is granted to temporarily download one copy of the materials (information or software) on LifeFlow's application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
    <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by LifeFlow at any time.</p>
    <p>The materials on LifeFlow's application are provided on an 'as is' basis. LifeFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
    <p>In no event shall LifeFlow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LifeFlow's application.</p>
    <p>LifeFlow has not reviewed all of the sites linked to its application and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LifeFlow of the site.</p>
    <p>LifeFlow may revise these terms of service for its application at any time without notice. By using this application you are agreeing to be bound by the then current version of these terms of service.</p>
  </>
);

export const openSourceLicenses = (dependencies: Record<string, string>, devDependencies: Record<string, string>) => (
    <>
      <h3>Open Source Licenses</h3>
      <p>This application is built with the help of the following open source software:</p>
      
      <h4>Dependencies</h4>
      <ul>
        {Object.entries(dependencies).map(([name, version]) => (
          <li key={name}><strong>{name}</strong>: {version}</li>
        ))}
      </ul>

      <h4>Dev Dependencies</h4>
      <ul>
        {Object.entries(devDependencies).map(([name, version]) => (
          <li key={name}><strong>{name}</strong>: {version}</li>
        ))}
      </ul>
    </>
  );
