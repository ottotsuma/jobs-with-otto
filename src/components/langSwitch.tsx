import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const { locale, locales, asPath } = useRouter();

  return (
    <div>
      {locales.map((lng) => (
        <button
          key={lng}
          onClick={() => {
            window.location.href = `/${lng}${asPath.substring(3)}`; // Adjust path to switch languages
          }}
        >
          {lng === "en" ? "English" : lng === "fr" ? "Français" : "Deutsch"}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

// SSR

// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }

// client side

// import { useTranslation } from 'next-i18next';

// const MyComponent = () => {
//   const { t } = useTranslation('common');

//   return (
//     <div>
//       <h1>{t('welcome')}</h1>
//       <p>{t('goodbye')}</p>
//     </div>
//   );
// };

// export default MyComponent;
