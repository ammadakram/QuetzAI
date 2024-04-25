import './SideBar.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Dropdown } from 'antd';
import {
  MenuOutlined,
  HomeFilled,
  PlusCircleOutlined,
  FolderFilled,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Drawer, Divider } from 'antd';
import type { MenuProps } from 'antd';

interface SideBarItemProps {
  text: string;
  icon: string;
}

function SideBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [folderNames, setFolderNames] = useState<string[]>([
    'Folder 1',
    'Folder 2',
  ]);
  const [isRenaming, setIsRenaming] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const goToHome = () => {
    try {
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  const makeNewFolder = () => {
    try {
      const newName = 'Folder ' + (folderNames.length + 1);
      setFolderNames((prevNames) => [...prevNames, newName]);
    } catch (err) {
      console.error(err);
    }
  };

  //   const renameFolder = (index: number) => {
  //     setIsRenaming(true);
  //     setRenamingIndex(index);
  //     setNewFolderName(folderNames[index]);
  //   };

  //   const handleRenameConfirm = () => {
  //     console.log('Renaming folder to:', newFolderName);
  //     setFolderNames((prevNames) =>
  //       prevNames.map((name, index) =>
  //         index === renamingIndex ? newFolderName : name
  //       )
  //     );
  //     setIsRenaming(false);
  //     setNewFolderName('');
  //   };

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          className="dropdown-item drawer-dropdown-item"
          //   onClick={() => renameFolder(renamingIndex)}
        >
          <EditOutlined className="dropdown-icon" />
          Rename
        </div>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className="dropdown-item drawer-dropdown-item drawer-dropdown-delete">
          <DeleteOutlined className="dropdown-icon" />
          Delete Chat
        </div>
      ),
      key: '2',
    },
  ];

  const SideBarItem = ({ text, icon }: SideBarItemProps) => {
    let IconComponent = null;
    switch (icon) {
      case 'Home':
        IconComponent = HomeFilled;
        break;
      case 'Folder':
        IconComponent = FolderFilled;
        break;
      case 'NewFolder':
        IconComponent = PlusCircleOutlined;
        break;
      default:
        IconComponent = null; // Default to HomeFilled if icon is not recognized
    }

    return (
      <div
        className={`sidebar-item ${icon !== 'Home' ? 'sidebar-folder' : ''}`}
        onClick={
          icon === 'Home'
            ? goToHome
            : icon === 'NewFolder'
            ? makeNewFolder
            : () => {}
        }
      >
        {IconComponent ? <IconComponent className="sidebar-item-icon" /> : null}
        {!isRenaming && text}
        {/* {isRenaming && (
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={handleRenameConfirm}
            autoFocus
          />
        )} */}
        {icon === 'Folder' && (
          <>
            <Dropdown
              className="user-dropdown"
              menu={{ items }}
              trigger={['click']}
            >
              <Tooltip placement="top" title={<span>Options</span>}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.88 29.956"
                  enable-background="new 0 0 122.88 29.956"
                  className="sidebar-item-icon sidebar-options-icon"
                >
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M122.88,14.978c0,8.271-6.708,14.979-14.979,14.979s-14.976-6.708-14.976-14.979 C92.926,6.708,99.631,0,107.901,0S122.88,6.708,122.88,14.978L122.88,14.978z M29.954,14.978c0,8.271-6.708,14.979-14.979,14.979 S0,23.248,0,14.978C0,6.708,6.705,0,14.976,0S29.954,6.708,29.954,14.978L29.954,14.978z M76.417,14.978 c0,8.271-6.708,14.979-14.979,14.979c-8.27,0-14.978-6.708-14.978-14.979C46.46,6.708,53.168,0,61.438,0 C69.709,0,76.417,6.708,76.417,14.978L76.417,14.978z"
                    />
                  </g>
                </svg>
              </Tooltip>
            </Dropdown>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Tooltip placement="rightTop" title={<span>Menu</span>}>
        <MenuOutlined className="sidebar-img" onClick={showDrawer} />
      </Tooltip>
      <Drawer
        className="sidebar-home"
        style={{ backgroundColor: '#2b2b2b', color: '#ffffff' }}
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <SideBarItem text="Home" icon="Home" />
        <Divider style={{ backgroundColor: 'rgb(148, 153, 153)' }} />
        {folderNames.map((folderName) => (
          <SideBarItem text={folderName} icon="Folder" />
        ))}
        <SideBarItem text="New Folder" icon="NewFolder" />
      </Drawer>
    </>
  );
}

export default SideBar;
