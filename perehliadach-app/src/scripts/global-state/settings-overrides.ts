import { atom } from 'recoil';
import { createLogger } from '../app-core/logger';
import settingsStorage, { ApplicationSetttingsOverrides } from '../user-settings/storage';

const logger = createLogger('settings-overrides.state');

const settingsOverridesState = atom<ApplicationSetttingsOverrides | null>({
  key: 'settings-overrides',
  default: null,
  effects: [
    ({ onSet, setSelf }) => {
      const onInitialization = (settings: ApplicationSetttingsOverrides) => {
        logger.info('Initialized application settings overrides', settings)
        setSelf(settings)
      };

      const onInitializationException = (error: any) => {
        logger.error('Failed to initialize the application settings overrides')
        logger.error(error)
      };

      if (typeof(window) !== 'undefined') {
        settingsStorage.readFromFile()
          .then(onInitialization)
          .catch(onInitializationException);
      }

      onSet(
        async (newValue) => {
          if (newValue == null) {
            return;
          }

          logger.info('Saving the application settings overrides', newValue);

          settingsStorage.writeToFile(newValue)
            .catch(e => logger.error('Failed to save the application settings overrides', e));
        }
      );
    }
  ]
});

export default settingsOverridesState;
