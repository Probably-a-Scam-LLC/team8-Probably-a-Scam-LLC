module.exports = async function (context, req) {
  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      message: "API is running",
      project: "Team8 Probably a Scam LLC",
      status: "online",
      timestamp: new Date().toISOString()
    }
  };
};
