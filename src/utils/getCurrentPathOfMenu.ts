import { MenuEntity } from '@/src/types/menu/menu.entity';

/**
 * 根据id寻找家族属性集合
 */

export interface GetCurrentPathProps {
  id?: string;
  familyProp: string;
  menu: MenuEntity[];
}

const getCurrentPathOfMenu = (props: GetCurrentPathProps) => {
  const { id, familyProp, menu } = props;
  const path = [] as string[];
  if (id) {
    const find = (data: MenuEntity[]) => {
      if (data.length === 1) {
        path.push(data[0][familyProp]);
      } else {
        data.forEach((item) => {
          if (item.id === id) {
            path.push(item[familyProp]);
            if (item.parent !== '0') {
              find(data.filter((m) => m.id === item.parent));
            }
          }
        });
      }
    };
    find(menu);
  }
  return path.reverse();
};

export default getCurrentPathOfMenu;
