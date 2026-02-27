import Map "mo:core/Map";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type OldSpotlight = {
    id : Text;
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    link : ?Text;
  };

  type OldActor = {
    articles : Map.Map<Text, { id : Text; title : Text; url : Text; timestamp : Time.Time; thumbnail : Storage.ExternalBlob }>;
    xPosts : Map.Map<Text, { id : Text; description : Text; image : Storage.ExternalBlob; timestamp : Time.Time }>;
    spotlights : Map.Map<Text, OldSpotlight>;
    wisdomEntries : Map.Map<Text, { id : Text; quote : Text; author : Text; timestamp : Time.Time }>;
    resources : Map.Map<Text, { id : Text; name : Text; description : Text; url : Text }>;
    cybercrimeArticles : Map.Map<Text, { id : Text; title : Text; url : Text; timestamp : Time.Time; thumbnail : Storage.ExternalBlob }>;
    homePageLinks : Map.Map<Text, { id : Text; title : Text; url : Text; thumbnail : Storage.ExternalBlob }>;
    missionContent : ?{ title : Text; description : Text; images : [Storage.ExternalBlob] };
  };

  type NewSpotlight = {
    id : Text;
    title : Text;
    content : Text;
    image : Storage.ExternalBlob;
    timestamp : Time.Time;
    link : ?Text;
  };

  type NewActor = {
    articles : Map.Map<Text, { id : Text; title : Text; url : Text; timestamp : Time.Time; thumbnail : Storage.ExternalBlob }>;
    xPosts : Map.Map<Text, { id : Text; description : Text; image : Storage.ExternalBlob; timestamp : Time.Time }>;
    spotlights : Map.Map<Text, NewSpotlight>;
    wisdomEntries : Map.Map<Text, { id : Text; quote : Text; author : Text; timestamp : Time.Time }>;
    resources : Map.Map<Text, { id : Text; name : Text; description : Text; url : Text }>;
    cybercrimeArticles : Map.Map<Text, { id : Text; title : Text; url : Text; timestamp : Time.Time; thumbnail : Storage.ExternalBlob }>;
    homePageLinks : Map.Map<Text, { id : Text; title : Text; url : Text; thumbnail : Storage.ExternalBlob }>;
    missionContent : ?{ title : Text; description : Text; images : [Storage.ExternalBlob] };
  };

  public func run(from : OldActor) : NewActor {
    let newSpotlights = from.spotlights.map<Text, OldSpotlight, NewSpotlight>(
      func(_id, oldSpotlight) {
        {
          id = oldSpotlight.id;
          title = oldSpotlight.title;
          content = oldSpotlight.content;
          image = switch (oldSpotlight.image) {
            case (null) { "" };
            case (?img) { img };
          };
          timestamp = oldSpotlight.timestamp;
          link = oldSpotlight.link;
        };
      }
    );

    {
      from with
      spotlights = newSpotlights
    };
  };
};
