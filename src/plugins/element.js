import Vue from 'vue'
import {
  Button,
  Container,
  Aside,
  Main,
  Header,
  Row,
  Col,
  Input,
  Avatar,
  Menu,
  Submenu,
  MenuItem,
  Popover,
  Divider,
  Tag,
  Pagination,
  Select,
  Option,
  Form,
  FormItem,
  Dialog,
  Card,
  Timeline,
  TimelineItem,
  Link,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Badge,
  Table,
  TableColumn,
  Switch,
  Rate,
  Backtop,
  Tree,
  Drawer,
  Cascader,
  Breadcrumb,
  BreadcrumbItem,
  Loading,
  MessageBox
} from 'element-ui'

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue
  .use(Button)
  .use(Container)
  .use(Aside)
  .use(Main)
  .use(Header)
  .use(Row)
  .use(Col)
  .use(Input)
  .use(Avatar)
  .use(Menu)
  .use(MenuItem)
  .use(Submenu)
  .use(Popover)
  .use(Divider)
  .use(Tag)
  .use(Pagination)
  .use(Select)
  .use(Option)
  .use(Form)
  .use(FormItem)
  .use(Dialog)
  .use(Card)
  .use(Timeline)
  .use(TimelineItem)
  .use(Link)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Badge)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Rate)
  .use(Backtop)
  .use(Tree)
  .use(Drawer)
  .use(Cascader)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Loading)


Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000}
