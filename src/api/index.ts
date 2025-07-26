import * as profileDetail from '@/api/profile';
import * as tagsCard from '@/api/tags-card';
import * as Notice from '@/api/notice-board';
import * as Article from '@/api/article';
import * as Achieve from '@/api/achieve';
import * as Wiki from '@/api/wiki';
import * as Login from '@/api/login';
import * as AdminDashBoard from '@/api/admin-dash-board';
import * as AdminUser from '@/api/admin-user';
import * as AdminArticle from '@/api/admin-article';
import * as AdminCategory from '@/api/admin-category';
import * as AdminTag from '@/api/admin-tag';

export default class API {
  // front
  static profileDetail = profileDetail;
  static tagsCard = tagsCard;
  static Notice = Notice;
  static Article = Article;
  static Achieve = Achieve;
  static Wiki = Wiki;

  // back
  static Login = Login;
  static AdminUser = AdminUser;
  static AdminDashBoard = AdminDashBoard;
  static AdminArticle = AdminArticle;
  static AdminCategory = AdminCategory;
  static AdminTag = AdminTag;
}
