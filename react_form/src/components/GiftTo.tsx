import {
  Autocomplete,
  TextField,
  Box,
  createFilterOptions,
} from '@mui/material';
import type { GiftRecipient } from 'types/GiftRecipient';

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: GiftRecipient) => option.name + option.username,
});

type GiftToProps = {
  giftRecipient?: string | undefined;
  recipients: GiftRecipient[];
  updateFields: (fields: { giftRecipient?: string | undefined }) => void;
};

export default function GiftTo({
  giftRecipient,
  recipients,
  updateFields,
}: GiftToProps) {
  const recipient: GiftRecipient | undefined =
    giftRecipient === undefined
      ? undefined
      : recipients.find((v) => v.id === giftRecipient);
  return (
    <Autocomplete
      disablePortal
      id="gift to"
      options={recipients}
      fullWidth
      value={recipient}
      getOptionLabel={(option) => option.name}
      filterOptions={filterOptions}
      onChange={(e, v) => updateFields({ giftRecipient: v?.id })}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={option.avatarUri} alt="avatar" />
          {option.name + ' ' + option.username}
        </Box>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Select recipient" />
      )}
    />
  );
}
