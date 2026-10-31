import AppsIcon from '@mui/icons-material/Apps';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import ListIcon from '@mui/icons-material/List';
import MemoryIcon from '@mui/icons-material/Memory';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import TaskIcon from '@mui/icons-material/Task';

/**
 * icon name (saved on menu in backend) -> MUI icon
 * new icon -> import it above and add one line here
 * "SendToDashboard" kept for menus saved with old rsuite icon name
 */
const MENU_ICONS = {
    Apps: AppsIcon,
    Assignment: AssignmentIcon,
    BlurOn: BlurOnIcon,
    Dashboard: DashboardIcon,
    Description: DescriptionIcon,
    Folder: FolderIcon,
    Group: GroupIcon,
    List: ListIcon,
    Memory: MemoryIcon,
    Person: PersonIcon,
    SendToDashboard: DashboardIcon,
    Settings: SettingsIcon,
    Task: TaskIcon
};

export const MENU_ICON_NAMES = Object.keys(MENU_ICONS);

//? unknown / empty name -> Apps icon
const MenuIcon = ({ name, ...props }) => {
    const Icon = MENU_ICONS[name] || AppsIcon;
    return <Icon {...props} />;
};

export default MenuIcon;
