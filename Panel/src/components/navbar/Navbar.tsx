import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

interface NavbarProps {
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  isMenuCollapsed,
  setIsMenuCollapsed,
}) => {
  return (
    <div className="flex justify-between items-center px-6 text-red-600 border-b-2 border-b-gray-400 py-7">
      <div className="flex">
        <div>
          <Button
            variant="contained"
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          >
            <HomeIcon />
          </Button>
        </div>
        <div className="text-2xl ml-6">TeknoShopia</div>
      </div>
      <div className="text-2xl">Icons</div>
    </div>
  );
};

export default Navbar;
