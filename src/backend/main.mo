import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Article = {
    id : Text;
    title : Text;
    url : Text;
    timestamp : Time.Time;
    thumbnail : Storage.ExternalBlob;
  };

  module Article {
    public func compareByTimestamp(a1 : Article, a2 : Article) : Order.Order {
      if (a1.timestamp < a2.timestamp) { #less } else if (a1.timestamp > a2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByTitle(a1 : Article, a2 : Article) : Order.Order {
      Text.compare(a1.title, a2.title);
    };
  };

  type XPost = {
    id : Text;
    description : Text;
    image : Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  module XPost {
    public func compareByTimestamp(p1 : XPost, p2 : XPost) : Order.Order {
      if (p1.timestamp < p2.timestamp) { #less } else if (p1.timestamp > p2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  type Spotlight = {
    id : Text;
    title : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type Wisdom = {
    id : Text;
    quote : Text;
    author : Text;
    timestamp : Time.Time;
  };

  type Resource = {
    id : Text;
    name : Text;
    description : Text;
    url : Text;
  };

  let articles = Map.empty<Text, Article>();
  let xPosts = Map.empty<Text, XPost>();
  let spotlights = Map.empty<Text, Spotlight>();
  let wisdomEntries = Map.empty<Text, Wisdom>();
  let resources = Map.empty<Text, Resource>();
  let cybercrimeArticles = Map.empty<Text, Article>();

  func generateIdForTitleOrUrl(title : Text) : Text {
    let timestampText = Time.now().toText();
    let sanitized = title.trimEnd(#char '-');
    sanitized.concat("_".concat(timestampText));
  };

  public shared ({ caller }) func addArticle(title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async () {
    let id = generateIdForTitleOrUrl(title.concat(url));
    let article : Article = {
      id;
      title;
      url;
      thumbnail;
      timestamp = Time.now();
    };
    articles.add(id, article);
  };

  public query ({ caller }) func getAllArticles() : async [Article] {
    articles.values().toArray().sort(Article.compareByTimestamp);
  };

  public query ({ caller }) func getArticlesSortedByTitle() : async [Article] {
    articles.values().toArray().sort(Article.compareByTitle);
  };

  public shared ({ caller }) func addXPost(description : Text, image : Storage.ExternalBlob) : async () {
    let id = generateIdForTitleOrUrl(description);
    let xPost : XPost = {
      id;
      description;
      image;
      timestamp = Time.now();
    };
    xPosts.add(id, xPost);
  };

  public query ({ caller }) func getAllXPosts() : async [XPost] {
    xPosts.values().toArray().sort(XPost.compareByTimestamp);
  };

  public shared ({ caller }) func addSpotlight(title : Text, content : Text) : async () {
    let id = generateIdForTitleOrUrl(title);
    let spotlight : Spotlight = {
      id;
      title;
      content;
      timestamp = Time.now();
    };
    spotlights.add(id, spotlight);
  };

  public query ({ caller }) func getAllSpotlights() : async [Spotlight] {
    let iter = spotlights.entries();
    let array = iter.toArray();
    array.reverse().map(func((_, s)) { s });
  };

  public shared ({ caller }) func addWisdom(quote : Text, author : Text) : async () {
    let id = generateIdForTitleOrUrl(quote.concat(author));
    let wisdom : Wisdom = {
      id;
      quote;
      author;
      timestamp = Time.now();
    };
    wisdomEntries.add(id, wisdom);
  };

  public query ({ caller }) func getAllWisdom() : async [Wisdom] {
    wisdomEntries.values().toArray();
  };

  public shared ({ caller }) func addResource(name : Text, description : Text, url : Text) : async () {
    let id = generateIdForTitleOrUrl(name);
    let resource : Resource = {
      id;
      name;
      description;
      url;
    };
    resources.add(id, resource);
  };

  public query ({ caller }) func getAllResources() : async [Resource] {
    resources.values().toArray();
  };

  public shared ({ caller }) func addCybercrimeArticle(title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async () {
    let id = generateIdForTitleOrUrl(title.concat(url));
    let article : Article = {
      id;
      title;
      url;
      thumbnail;
      timestamp = Time.now();
    };
    cybercrimeArticles.add(id, article);
  };

  public query ({ caller }) func getAllCybercrimeArticles() : async [Article] {
    cybercrimeArticles.values().toArray();
  };
};
