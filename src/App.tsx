import { useCallback, useEffect, useState } from 'react';
import { createInvitation } from './lib/api';
import { ParlorExperience } from './components/ParlorExperience';
import { SetupStudio } from './components/SetupStudio';

interface RouteState {
  view: 'setup' | 'parlor';
  token: string | null;
}

function parseLocation(): RouteState {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/parlor\/([A-Za-z0-9_-]+)\/?$/);
  if (match) {
    return { view: 'parlor', token: match[1] };
  }
  return { view: 'setup', token: null };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseLocation());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToParlor = useCallback((token: string) => {
    const nextPath = `/parlor/${token}`;
    window.history.pushState({}, '', nextPath);
    setRoute({ view: 'parlor', token });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToSetup = useCallback(() => {
    window.history.pushState({}, '', '/');
    setRoute({ view: 'setup', token: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Support ?autostart=1 for instant demo/testing straight into a Beekeeper parlor consultation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && route.view === 'setup') {
      createInvitation({
        presetId: 'the-beekeeper-2024',
        householdServices: ['prime', 'netflix'],
        salutation: 'Dearest',
      })
        .then(({ token }) => {
          navigateToParlor(token);
        })
        .catch(() => {
          // Stay on setup studio if autostart fails
        });
    }
  }, [navigateToParlor, route.view]);

  if (route.view === 'parlor' && route.token) {
    return (
      <ParlorExperience
        token={route.token}
        onReturnToSetup={navigateToSetup}
      />
    );
  }

  return <SetupStudio onLaunchParlor={navigateToParlor} />;
}
