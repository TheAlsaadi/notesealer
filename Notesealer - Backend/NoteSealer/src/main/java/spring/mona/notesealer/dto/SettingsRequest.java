package spring.mona.notesealer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SettingsRequest {
    private boolean autoSave;
    private boolean alternativeTheme;
}