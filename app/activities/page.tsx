import { ActivityCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";

const activities = [
  {
    title: "Whale Watching",
    subtitle: "Half day",
    description: "Seasonal activity pages can be promoted with destination content and add-ons.",
    meta: "Popular",
    href: "/activities/whale-watching",
  },
  {
    title: "Tea Estate Walk",
    subtitle: "2 hours",
    description: "A scenic experience for hill country itineraries and small groups.",
    meta: "Nature",
    href: "/activities/tea-estate-walk",
  },
  {
    title: "Village Cooking",
    subtitle: "Hands-on",
    description: "A cultural add-on with local host storytelling and practical booking info.",
    meta: "Culture",
    href: "/activities/village-cooking",
  },
];

export default function ActivitiesPage() {
  return (
    <PublicTourismPage
      eyebrow="Activities"
      title="Activities and experiences"
      description="Manage destination experiences, short tours, and add-ons in the same tourism platform."
    >
      {activities.map((activity) => (
        <ActivityCard key={activity.title} {...activity} />
      ))}
    </PublicTourismPage>
  );
}
