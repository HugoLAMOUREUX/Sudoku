package game.models;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class GridDataModel {
    private int id;
    private int[] values;
    private Map<String, Integer> highScores;

    public GridDataModel(final int[] values, final String name, final int score) {
        this.id = 0;
        this.values = Arrays.copyOf(values, values.length);
        this.highScores = new HashMap<String, Integer>();
        this.highScores.put(name, score);
    }

}
