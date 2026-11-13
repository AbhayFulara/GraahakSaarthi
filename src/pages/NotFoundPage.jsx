import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button, EmptyState } from '../components/common';

export function NotFoundPage() {
  return (
    <div className="gs-container" style={{ paddingBlock: 72 }}>
      <EmptyState
        icon={Compass}
        title="Page Not Found"
        description="The GraahakSaarthi page you requested could not be found or has moved."
        action={
          <Link to="/">
            <Button variant="primary">Return to Home</Button>
          </Link>
        }
      />
    </div>
  );
}
