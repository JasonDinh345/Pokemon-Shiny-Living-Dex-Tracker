import { server } from "./server";

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
