export async function GET() {
  //const appUrl = process.env.NEXT_PUBLIC_URL;
  const appUrl = "https://frames-v2-theta.vercel.app";
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQ0MzcxMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDk5ODk1OTU5NmMxYjk2QTUzM2Q5QmY0MzFDMzE5M2NlZmQwMDkxY0EifQ",
      payload:
        "eyJkb21haW4iOiJodHRwczovL2ZyYW1lcy12Mi10aGV0YS52ZXJjZWwuYXBwIn0",
      signature:
        "MHhmNzAwNGFiOGJiYTUzYWY4ODZkNTZmZjNhNWExOWZiNjhkZTk0MWU3NDZhMjNmMTg0NWJjNjY2NzIzZjk4NmRmMTUxMTI0YTkwMzJjMmI0OTliMTI5NmUyMGU0MTUxYjZlMmFkMWM5NjNiOTI1MzFjMjE0NTEzMjYxNWEyNDcwOTFi",
    },
    frame: {
      version: "0.0.0",
      name: "Baseship v2 TEST",
      iconUrl: `${appUrl}/baseship.svg`,
      splashImageUrl: `${appUrl}/baseship.svg`,
      splashBackgroundColor: "#f7f7f7",
      homeUrl: appUrl,
    },
  };

  return Response.json(config);
}
