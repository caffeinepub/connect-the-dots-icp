import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
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

  type XPost = {
    id : Text;
    description : Text;
    image : Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type Spotlight = {
    id : Text;
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    link : ?Text;
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

  type MissionContent = {
    title : Text;
    description : Text;
    images : [Storage.ExternalBlob];
  };

  type HomePageLink = {
    id : Text;
    title : Text;
    url : Text;
    thumbnail : Storage.ExternalBlob;
  };

  let articles = Map.empty<Text, Article>();
  let xPosts = Map.empty<Text, XPost>();
  let spotlights = Map.empty<Text, Spotlight>();
  let wisdomEntries = Map.empty<Text, Wisdom>();
  let resources = Map.empty<Text, Resource>();
  let cybercrimeArticles = Map.empty<Text, Article>();
  let homePageLinks = Map.empty<Text, HomePageLink>();
  var missionContent : ?MissionContent = null;

  public shared ({ caller }) func addArticle(title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async () {
    let id = Time.now().toText();
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
    articles.values().toArray();
  };

  public query ({ caller }) func getArticlesSortedByTitle() : async [Article] {
    articles.values().toArray().sort(
      func(a, b) {
        Text.compare(a.title, b.title);
      }
    );
  };

  public shared ({ caller }) func updateArticle(id : Text, title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async Bool {
    switch (articles.get(id)) {
      case (null) { false };
      case (?oldArticle) {
        let updatedArticle : Article = {
          id = oldArticle.id;
          title;
          url;
          thumbnail;
          timestamp = oldArticle.timestamp;
        };
        articles.add(id, updatedArticle);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Text) : async Bool {
    switch (articles.get(id)) {
      case (null) { false };
      case (?_) {
        articles.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func addXPost(description : Text, image : Storage.ExternalBlob) : async () {
    let id = Time.now().toText();
    let xPost : XPost = {
      id;
      description;
      image;
      timestamp = Time.now();
    };
    xPosts.add(id, xPost);
  };

  public query ({ caller }) func getAllXPosts() : async [XPost] {
    xPosts.values().toArray().sort(
      func(a, b) {
        if (a.timestamp < b.timestamp) { #less } else if (a.timestamp > b.timestamp) {
          #greater;
        } else {
          #equal;
        };
      }
    );
  };

  public shared ({ caller }) func updateXPost(id : Text, description : Text, image : Storage.ExternalBlob) : async Bool {
    switch (xPosts.get(id)) {
      case (null) { false };
      case (?oldXPost) {
        let updatedXPost : XPost = {
          id = oldXPost.id;
          description;
          image;
          timestamp = oldXPost.timestamp;
        };
        xPosts.add(id, updatedXPost);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteXPost(id : Text) : async Bool {
    switch (xPosts.get(id)) {
      case (null) { false };
      case (?_) {
        xPosts.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func addSpotlight(title : Text, content : Text, image : ?Storage.ExternalBlob, link : ?Text) : async () {
    let id = Time.now().toText();
    let spotlight : Spotlight = {
      id;
      title;
      content;
      image;
      link;
      timestamp = Time.now();
    };
    spotlights.add(id, spotlight);
  };

  public query ({ caller }) func getAllSpotlights() : async [Spotlight] {
    let iter = spotlights.entries();
    let array = iter.toArray();
    array.reverse().map(func((_, s)) { s });
  };

  public shared ({ caller }) func updateSpotlight(id : Text, title : Text, content : Text, image : ?Storage.ExternalBlob, link : ?Text) : async Bool {
    switch (spotlights.get(id)) {
      case (null) { false };
      case (?oldSpotlight) {
        let updatedSpotlight : Spotlight = {
          id = oldSpotlight.id;
          title;
          content;
          image;
          link;
          timestamp = oldSpotlight.timestamp;
        };
        spotlights.add(id, updatedSpotlight);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSpotlight(id : Text) : async Bool {
    switch (spotlights.get(id)) {
      case (null) { false };
      case (?_) {
        spotlights.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func addWisdom(quote : Text, author : Text) : async () {
    let id = Time.now().toText();
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

  public shared ({ caller }) func updateWisdom(id : Text, quote : Text, author : Text) : async Bool {
    switch (wisdomEntries.get(id)) {
      case (null) { false };
      case (?oldWisdom) {
        let updatedWisdom : Wisdom = {
          id = oldWisdom.id;
          quote;
          author;
          timestamp = oldWisdom.timestamp;
        };
        wisdomEntries.add(id, updatedWisdom);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteWisdom(id : Text) : async Bool {
    switch (wisdomEntries.get(id)) {
      case (null) { false };
      case (?_) {
        wisdomEntries.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func addResource(name : Text, description : Text, url : Text) : async () {
    let id = Time.now().toText();
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

  public shared ({ caller }) func updateResource(id : Text, name : Text, description : Text, url : Text) : async Bool {
    switch (resources.get(id)) {
      case (null) { false };
      case (?_oldResource) {
        let updatedResource : Resource = {
          id;
          name;
          description;
          url;
        };
        resources.add(id, updatedResource);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteResource(id : Text) : async Bool {
    switch (resources.get(id)) {
      case (null) { false };
      case (?_) {
        resources.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func addCybercrimeArticle(title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async () {
    let id = Time.now().toText();
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

  public shared ({ caller }) func updateCybercrimeArticle(id : Text, title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async Bool {
    switch (cybercrimeArticles.get(id)) {
      case (null) { false };
      case (?oldArticle) {
        let updatedArticle : Article = {
          id = oldArticle.id;
          title;
          url;
          thumbnail;
          timestamp = oldArticle.timestamp;
        };
        cybercrimeArticles.add(id, updatedArticle);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteCybercrimeArticle(id : Text) : async Bool {
    switch (cybercrimeArticles.get(id)) {
      case (null) { false };
      case (?_) {
        cybercrimeArticles.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func updateMissionContent(title : Text, description : Text, images : [Storage.ExternalBlob]) : async () {
    missionContent := ?{
      title;
      description;
      images;
    };
  };

  public query ({ caller }) func getMissionContent() : async ?MissionContent {
    missionContent;
  };

  public shared ({ caller }) func addHomePageLink(title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async () {
    let id = Time.now().toText();
    let link : HomePageLink = {
      id;
      title;
      url;
      thumbnail;
    };
    homePageLinks.add(id, link);
  };

  public shared ({ caller }) func updateHomePageLink(id : Text, title : Text, url : Text, thumbnail : Storage.ExternalBlob) : async Bool {
    switch (homePageLinks.get(id)) {
      case (null) { false };
      case (?oldLink) {
        let updatedLink : HomePageLink = {
          id = oldLink.id;
          title;
          url;
          thumbnail;
        };
        homePageLinks.add(id, updatedLink);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteHomePageLink(id : Text) : async Bool {
    switch (homePageLinks.get(id)) {
      case (null) { false };
      case (?_) {
        homePageLinks.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func getAllHomePageLinks() : async [HomePageLink] {
    homePageLinks.values().toArray();
  };
};
