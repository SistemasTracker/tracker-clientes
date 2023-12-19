import { useMemo } from 'react';

// eslint-disable-next-line import/no-anonymous-default-export, react-hooks/exhaustive-deps
export default () => useMemo(() => ({
  speedLimit: {
    name: 'attributeSpeedLimit',
    type: 'number',
    subtype: 'speed',
  },
  fuelDropThreshold: {
    name: 'attributeFuelDropThreshold',
    type: 'number',
  },
  fuelIncreaseThreshold: {
    name: 'attributeFuelIncreaseThreshold',
    type: 'number',
  },
  'report.ignoreOdometer': {
    name: 'attributeReportIgnoreOdometer',
    type: 'boolean',
  },
  isFMB130: {
    name: 'FMB 130',
    type: 'boolean',
  },
  hasCommandLockUnlock: {
    name: 'Tiene Permisos de Bloqueo',
    type: 'boolean',
  },
}));
