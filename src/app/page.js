import AreasOfExpertise from "./component/home/areas";
import Herohome from "./component/home/herohome";
import FeaturedLawyers from "./component/home/FeaturedLawyers";

export default function Home() {
  return (
    <div>
      <Herohome />
      <AreasOfExpertise />
      <FeaturedLawyers />
    </div>
  );
}
