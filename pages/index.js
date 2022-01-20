export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;
  let token = "";
  if (cookies && cookies.includes("token=")) {
    token = cookies.replace("token=", "");
  }
  if (token) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

const index = () => {
  return null;
};

export default index;
